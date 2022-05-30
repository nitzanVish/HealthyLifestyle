import db from '../../services/db';

export default async function screensSettings(req, res) {
    //Save data inside fireStore
    if(req.method === 'POST'){
        let obj = JSON.parse(req.body)
        const { id } = await db.collection(obj.collectionName).add(obj.userData);
        res.status(200).json({ id });

    } else if (req.method === 'GET'){
        //Get data from fireStore
        const settingsRef = db.collection('screens_settings');
        const snapshot = await settingsRef.where('screenID', '==', "default").get();
        if (snapshot.empty) {
            console.log('No matching documents.');
            return;
        }  

        snapshot.forEach(doc => {
            return res.status(200).json(doc.data());
        });

    }
}