import CryptoJS from "crypto-js";

/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */

const PUBLIC_KEY="00ad963d2cc95c13e2e72b72dfed92f0";
const PRIVATE_KEY="5abe40991ba0e9a2a118b1f6b2fa06b383b2287a";
const BASE_URL = "https://gateway.marvel.com/v1/public/characters";


export const getData = async (url) => {
    const ts = Date.now().toString(); // Timestamp en millisecondes
    const hash = getHash(PUBLIC_KEY, PRIVATE_KEY, ts);
    const fullUrl = `${url}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;

    console.log("Requête envoyée à :", fullUrl); // Debugging

    const response = await fetch(fullUrl);
    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const data = await response.json();
    const characters = data.data.results
        .filter(char => char.thumbnail && !char.thumbnail.path.includes("image_not_available"))
        .map(char => ({
            nom: char.name,
            description: char.description || "Aucune description disponible",
            imageUrl: `${char.thumbnail.path}/portrait_xlarge.${char.thumbnail.extension}`
        }));

    return characters;

}

/**
 * Calcul la valeur md5 dans l'ordre : timestamp+privateKey+publicKey
 * cf documentation developer.marvels.com
 * @param publicKey
 * @param privateKey
 * @param timestamp
 * @return {Promise<ArrayBuffer>} en hexadecimal
 */
export const getHash = async (publicKey, privateKey, timestamp) => {
    return Promise.resolve(CryptoJS.MD5(timestamp + privateKey + publicKey).toString());
}