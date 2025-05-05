

export const approved = async ({name, email, clientId}: any) => {
    try {
        const res = await fetch("http://localhost:5000/email/approved", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, clientId }),
        });
        if (!res.ok) {
            console.log("success")
        }
        return console.log("error")
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
}

export default approved