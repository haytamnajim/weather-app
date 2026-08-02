/**
 * Templates de prompts pour la génération d'images IA
 * Utilise le style mannequin 3D low-poly pour afficher les tenues vestimentaires
 */

/**
 * Génère un prompt pour un mannequin 3D portant des vêtements spécifiques
 * @param {string} clothing - Liste des vêtements en anglais (ex: "light gray jacket, white t-shirt, blue jeans")
 * @param {Object} options - Options de personnalisation
 * @returns {string} Le prompt optimisé pour l'IA
 */
export function generateMannequinPrompt(clothing, options = {}) {
    const {
        _gender = 'neutral',  // 'neutral', 'male', 'female'
        pose = 'T-pose',     // 'T-pose', 'standing', 'walking'
        accessories = [],    // Array d'accessoires: ['umbrella', 'sunglasses', 'hat']
        colorScheme = 'coral pink and brown'  // Couleurs du mannequin
    } = options;

    // Construction du prompt de base
    let prompt = `A 3D low-poly stylized mannequin figure in ${pose} wearing ${clothing}`;

    // Ajout des accessoires
    if (accessories.length > 0) {
        prompt += `, holding/wearing ${accessories.join(', ')}`;
    }

    // Style et finition
    prompt += `, smooth matte ${colorScheme} color scheme, articulated joints visible at neck torso knees and ankles, simplified geometric shapes, grey gradient background with subtle floor shadow, minimalist 3D render, no facial features, fashion display, soft studio lighting`;

    return prompt;
}

/**
 * Suggestions de vêtements basées sur la température et la météo
 * @param {number} temp - Température en °C
 * @param {string} description - Description météo
 * @returns {Object} Suggestions de tenues avec prompts
 */
export function getSuggestedOutfits(temp, description) {
    const isRaining = description.toLowerCase().includes('pluie') || description.toLowerCase().includes('rain');
    const isSunny = description.toLowerCase().includes('ensoleillé') || description.toLowerCase().includes('sunny') || description.toLowerCase().includes('clear');

    let outfits = [];

    if (temp < 10) {
        // Temps froid
        outfits = [
            {
                name: "Look Chaud Classique",
                clothing: "heavy winter coat, warm scarf, thick sweater, dark jeans, winter boots",
                accessories: isRaining ? ['umbrella'] : [],
                description: "🧥 Manteau chaud, écharpe, pull épais et bottes d'hiver"
            },
            {
                name: "Look Urbain Hivernal",
                clothing: "puffer jacket, turtleneck sweater, warm pants, sneakers, beanie hat",
                accessories: ['beanie'],
                description: "🧢 Doudoune, col roulé, pantalon chaud et bonnet"
            },
            {
                name: "Look Marocain Traditionnel",
                clothing: "heavy djellaba robe, traditional hood, warm layers underneath",
                accessories: [],
                description: "🇲🇦 Djellaba épaisse avec capuche et couches chaudes"
            }
        ];
    } else if (temp >= 10 && temp < 18) {
        // Temps frais
        outfits = [
            {
                name: "Look Décontracté",
                clothing: "light jacket, long-sleeve shirt, jeans, casual shoes",
                accessories: isRaining ? ['umbrella'] : [],
                description: "🧥 Veste légère, chemise à manches longues et jeans"
            },
            {
                name: "Look Smart Casual",
                clothing: "trench coat, button-up shirt, chino pants, loafers",
                accessories: isSunny ? ['sunglasses'] : [],
                description: "👔 Trench-coat, chemise boutonnée et pantalon chino"
            },
            {
                name: "Look Sport Confort",
                clothing: "hoodie sweatshirt, track pants, running shoes",
                accessories: [],
                description: "👟 Hoodie, pantalon de jogging et baskets"
            }
        ];
    } else if (temp >= 18 && temp < 25) {
        // Temps agréable
        outfits = [
            {
                name: "Look Printanier",
                clothing: "light sweater, t-shirt, casual pants, sneakers",
                accessories: isSunny ? ['sunglasses'] : [],
                description: "👕 Pull léger, t-shirt et pantalon décontracté"
            },
            {
                name: "Look Chic Décontracté",
                clothing: "blazer jacket, polo shirt, light jeans, dress shoes",
                accessories: isSunny ? ['sunglasses'] : [],
                description: "🕶️ Blazer, polo et jeans clair"
            },
            {
                name: "Look Marocain Moderne",
                clothing: "light cotton djellaba, comfortable sandals",
                accessories: [],
                description: "🇲🇦 Djellaba légère en coton avec sandales confortables"
            }
        ];
    } else {
        // Temps chaud (> 25°C)
        outfits = [
            {
                name: "Look Estival",
                clothing: "short-sleeve shirt, shorts, sandals, sun hat",
                accessories: ['sunglasses', 'sun hat'],
                description: "☀️ Chemise à manches courtes, short et chapeau de soleil"
            },
            {
                name: "Look Plage Urbain",
                clothing: "tank top, light linen pants, flip-flops",
                accessories: ['sunglasses'],
                description: "🩴 Débardeur, pantalon en lin léger et tongs"
            },
            {
                name: "Look Marocain d'Été",
                clothing: "light white cotton djellaba, traditional babouche slippers",
                accessories: isSunny ? ['traditional head covering'] : [],
                description: "🇲🇦 Djellaba blanche légère avec babouches traditionnelles"
            }
        ];
    }

    // Générer les prompts pour chaque tenue
    return outfits.map(outfit => ({
        ...outfit,
        prompt: generateMannequinPrompt(outfit.clothing, { accessories: outfit.accessories })
    }));
}

/**
 * Prompt pour l'agent IA n8n (Instructions complètes)
 */
export const WEATHER_AI_SYSTEM_PROMPT = `
---
CONTEXTE MÉTÉO ACTUEL :
Ville : {{ $json.body.weatherContext.city }}
Température : {{ $json.body.weatherContext.temp }}°C
Description : {{ $json.body.weatherContext.desc }}
---
MESSAGE DE L'UTILISATEUR :
{{ $json.body.message }}

RÔLE : Tu es l'expert mode et météo de "Météo Maroc". Tu conseilles et juges les tenues de manière amicale et moderne avec des emojis 🌤️👗

LOGIQUE DE RÉPONSE :

1. JUGEMENT DE TENUE : Si l'utilisateur mentionne ce qu'il porte :
   - Compare sa tenue avec la température et le ciel.
   - Dis-lui si c'est adapté, trop léger ou trop chaud.
   - Termine par : "Voulez-vous que je vous suggère un meilleur look en image ?"

2. CHANGEMENT DE VILLE : Si l'utilisateur veut voir une autre ville :
   - Réponds UNIQUEMENT : {"action": "change_city", "city": "Nom de la ville"}

3. SALUT / MÉTÉO : Sinon :
   - Donne la météo de la ville actuelle.
   - Demande : "Souhaitez-vous que je génère pour vous un look convenable ?"

4. SI OUI (LOOK) : Donne tes conseils vestimentaires puis termine par :
   IMAGE_PROMPT: A 3D low-poly stylized mannequin figure in T-pose wearing [LISTE DES VÊTEMENTS], smooth matte coral pink and brown color scheme, articulated joints visible at neck torso knees and ankles, simplified geometric shapes, grey gradient background with subtle floor shadow, minimalist 3D render, no facial features, fashion display, soft studio lighting

RÈGLES VESTIMENTAIRES :
- < 10°C : Gros manteau, écharpe, gants 🧥🧣
- 10-18°C : Veste légère, pull ou trench-coat 🧥
- 18-25°C : T-shirt, chemise légère, pantalon léger 👕
- > 25°C : Vêtements courts, lunettes de soleil, chapeau 🕶️👒
- S'il pleut : parapluie ou imperméable ☔
- Tiens compte du ciel et de la description météo
- SPÉCIAL MAROC : Propose aussi des tenues traditionnelles (djellaba, babouches) adaptées à la météo

RÈGLES D'OR :
- Parle en français (sauf IMAGE_PROMPT en anglais)
- Sois amical, moderne et utilise des emojis
- Garde tes réponses concises et utiles
- Les vêtements dans [LISTE DES VÊTEMENTS] doivent être en anglais et détaillés
- Propose 2-3 options de tenues au lieu d'une seule
`;
