export default async function getDataProfile(token) {
    try {
        if (!token) return;
        const response = await fetch("http://localhost:8008/users/myProfile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar perfil");
        }

        const result = await response.json();
        return result
    } catch (error) {
        console.error("Erro:", error);
    }
}