export const getTest = async () => {
    try{
     const rest = await fetch ("http://localhost:5000/test",{
        method: "GET",
        headers: {
            Accept : "application/json",
            "Content-Type" : "application/json",
        },
     });
     return await rest.json();
    }catch(err){

    }
}