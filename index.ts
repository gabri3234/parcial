import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const port = 3000;

type LD ={
    id: number
    filmName: string
    rotationType: "CAV" | "CLV",
    region: string,
    lengthMinutes: number,
    videoFormat: "NTSC" | "PAL"
}

let Peliculas:LD[] = [
    { id: 1, filmName: "Shrek", rotationType: "CAV", region: "europa", lengthMinutes: 120, videoFormat: "NTSC" },
    { id: 2, filmName: "el abogado del diablo", rotationType: "CLV", region: "USA", lengthMinutes: 90, videoFormat: "PAL" },
    { id: 3, filmName: "Django", rotationType: "CAV", region: "USA", lengthMinutes: 75, videoFormat: "NTSC" },
    { id: 4, filmName: "El Padrino", rotationType: "CLV", region: "europa", lengthMinutes: 85, videoFormat: "PAL" }
];
app.use(cors()); 
app.use(express.json())

app.get("/", (req, res) =>{
    res.json({
        message: "estas dentro"
    })
});

app.get("/Peliculas", (req, res)=>{
    res.json(Peliculas);
})
app.get("/Peliculas/:id", (req, res)=>{
    const idParams = req.params.id;
    const realID = Number(idParams);
    const buscado = Peliculas.find((elem)=>elem.id===realID)
    buscado ? res.json(buscado) : res.status(404).json({
        error: "La Pelicula no existe"
    })
})
app.post("/Peliculas",(req,res)=>{
    const lastid = Peliculas.at(-1)?.id;
    const nuevoid = lastid ? lastid + 1 : 1;
    const nuevofilmName = req.body.filmName;
    const nueevoregion = req.body.region;
    const nuevolengthMinutes = req.body.lengthMinutes;
    const nuevorotationType = req.body.rotationType;
    const nuevovideoFormat = req.body.videoFormat;
    const newPelicula: LD = {
        id: nuevoid,
        filmName: nuevofilmName,
        rotationType: nuevorotationType,
        region: nueevoregion,
        lengthMinutes: nuevolengthMinutes,
        videoFormat: nuevovideoFormat
    };
    Peliculas.push(newPelicula);
    res.status(201).json(newPelicula);
    if(nuevofilmName && nueevoregion && nuevolengthMinutes && nuevorotationType && nuevovideoFormat&& typeof(nuevofilmName) == "string" && typeof(nueevoregion) == "string" && typeof(nuevolengthMinutes)=="number" && typeof(nuevorotationType)=="string"&& typeof(nuevovideoFormat)=="string"){
            Peliculas.push(...req.body);
    res.status(201).json(req.body)
    } else{
        res.status(404).send("tipos incorrectos para pelicula")
    }
});
app.delete("/Peliculas/:id", (req, res)=>{
    if (Peliculas = Peliculas.filter((elem)=> elem.id != Number(req.params.id))){
    res.status(204).send("pelicula eliminada")
    }
    else{
        res.status(404).send("id incorrect de pelicula")
    }
})
app.listen(port, async () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
    await new Promise((r) => setTimeout(r, 1000));
    await pruebaApi();
});
async function pruebaApi() {
      try {
        console.log("\nLista inicial de peliculas");
        let res = await axios.get(`http://localhost:${port}/Peliculas`);
        console.log(res.data);
        console.log("\nAñadir nueva pelicula:");
        const newPelicula = { filmName: "percy jackson", rotationType: "CAV", region: "NA", lengthMinutes: 65, videoFormat: "NTSC" };
        res = await axios.post(`http://localhost:${port}/Peliculas`, newPelicula);
        const created = res.data;
        console.log("Creado: ", created);
        console.log("\nComprobamos que la peliculas está añadida:");
        res = await axios.get(`http://localhost:${port}/Peliculas`);
        console.log(res.data);
        console.log("\nEliminar pelicula");
        await axios.delete(`http://localhost:${port}/Peliculas/${created.id}`);
        console.log("\nLista peliculas: ");
        res = await axios.get(`http://localhost:${port}/Peliculas`);
        console.log(res.data);
        console.log("\nFin prueba");
    }
    catch (error) {
        console.error("Error en la API:", error.message);
    }


};