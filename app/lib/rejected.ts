

export const rejected = async ({name, email, clientId}: any) => {
    try {
        const res = await fetch("http://localhost:5000/email/rejected", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, clientId }),
        });

        if (!res.ok) {
            console.log("error")
        } 
        return console.log("success")
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    };
}

export default rejected