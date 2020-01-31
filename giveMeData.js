// [RESEAU DEF] SCRAP SIRET DATA
// https://entreprise.data.gouv.fr/
// 02/2020

///Besoin////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Récupérer les codes NAF associés à une liste de SIRET
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// npm install 
// node ./giveMeData.js
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
//   ___ ___   ___   ___    __ __  _        ___  _____//
//  |   |   | /   \ |   \  |  |  || |      /  _]/ ___///
//  | _   _ ||     ||    \ |  |  || |     /  [_(   \_ //
//  |  \_/  ||  O  ||  D  ||  |  || |___ |    _]\__  |//
//  |   |   ||     ||     ||  :  ||     ||   [_ /  \ |//
//  |   |   ||     ||     ||     ||     ||     |\    |//
//  |___|___| \___/ |_____| \__,_||_____||_____| \___|//
////////////////////////////////////////////////////////NPM
                                               
const fetch = require('node-fetch')
const fs = require('fs')

//////////////////////////////////////////////////////////////////////////////////////////
// _  _ ____ ____ _ ____ ___  _    ____ ____    ____ _    ____ ___  ____ _    ____ ____ //
// |  | |__| |__/ | |__| |__] |    |___ [__     | __ |    |  | |__] |__| |    |___ [__  //
//  \/  |  | |  \ | |  | |__] |___ |___ ___]    |__] |___ |__| |__] |  | |___ |___ ___] //
//////////////////////////////////////////////////////////////////////////////////////////

const outputFile = './finalFile.txt'
const listSIRET = './siretJson.json'
const associedValue = "activite_principale"

const API_URL = "https://entreprise.data.gouv.fr/api/sirene/v3/etablissements/"
const params = { method: 'get', headers: { 'Content-Type': 'application/json' } }

let index = 0
const date = new Date()

///////////////////////////////////////////////
//  ____ ____ _  _ ____ ___ _ ____ _  _ ____ //
//  |___ |  | |\ | |     |  | |  | |\ | [__  //
//  |    |__| | \| |___  |  | |__| | \| ___] //
///////////////////////////////////////////////

// Ecrit et cumule la data dans un fichier
const processInput = ( text ) => {     
  fs.open(outputFile, 'a', 666, ( line , id ) => {
    fs.write( id, text + "\n", null, 'utf8', () => {
      fs.close(id, () => {
        return
      })
    })
  })
}

// requete sur l'API data.gouve.fr pour récupérer la fiche id de l'établissement
const giveMeFetch = (siret,index) => {
  return fetch(`${API_URL}${siret}`, params )
      .then(res => res.json())
      .then(data => {
        if (data.etablissement) {
            // SIRET EXISTANT
            console.log(`le siret : ${siret} - ${data.etablissement[associedValue] } \r`) 
            processInput(`le siret : ${siret} - ${data.etablissement[associedValue]} \r`)
          } else {
            // SIRET NON-EXISTANT
            processInput(`NOK_ ${siret} \r`)
            console.log("NOK_",siret)
          }
      })
      .then(res => index + 1 )
      .catch(res => {
        // SIRET NON-EXISTANT
        processInput(`NOK_ ${siret} \r`)
        console.log("NOK_",siret)
        return index + 1 
      })
}

// Lecture du fichier JSON contenant la liste de SIRET
fs.readFile(listSIRET, 'utf-8', (err, data) => { 
  if (err) throw err

  // convertie le JSON en objet javascript 
  const etablissements = JSON.parse(data).siret
  
  //fonction récursive 
  const go = (index) => {
      giveMeFetch(etablissements[index], index)
      .then(res => {
        if (res < (etablissements.length - 1 ))
        // permet de ralentir les requetes et d'éviter un blocage de l'API
        setTimeout(() => go(res) , 142 )
      })
  }

  ////////////////////////////
  //___  ____ ___  _  _ ___ //
  //|  \ |___ |__] |  |  |  //
  //|__/ |___ |__] |__|  |  //
  //////////////////////////// Du processus

  console.clear()
  console.log(date)
  console.log("____________________")
  console.log("")
  console.log("DEBUT DU TRAITEMENT")
  console.log("____________________")
  console.log("")
  
  go(index)
    
})