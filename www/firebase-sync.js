// Optional Firebase cloud sync. Never stores data in a public collection.
(async () => {
  // Cloud release is disabled until consent, deletion and restore are verified.
  if (window.PETCARE_CLOUD_ENABLED !== true) return;
  if (window.petCareFamily?.isAdult() !== true) return;
  const cfg = window.PETCARE_FIREBASE_CONFIG;
  if (!cfg?.apiKey || !cfg?.projectId || !cfg?.appId) return;
  try {
    const v = '12.4.0';
    const [{initializeApp},{getAuth,signInAnonymously,onAuthStateChanged},{getFirestore,doc,getDoc,setDoc}] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/'+v+'/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/'+v+'/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/'+v+'/firebase-firestore.js')
    ]);
    const app=initializeApp(cfg),auth=getAuth(app),db=getFirestore(app);
    let user=null, pending=null, timer=null;
    async function push(snapshot) {
      if(!user) { pending=snapshot; return; }
      await setDoc(doc(db,'users',user.uid,'backups','current'),{
        data:snapshot, updatedAt:new Date().toISOString()
      });
    }
    window.petCareCloud={
      save(snapshot){
        pending=JSON.parse(JSON.stringify(snapshot));
        clearTimeout(timer);
        timer=setTimeout(async()=>{const next=pending;pending=null;try{await push(next)}catch(e){console.warn('Cloud sync failed:',e);pending=next}},1200);
      },
      status(){return user?'connected':'waiting'}
    };
    onAuthStateChanged(auth,async u=>{
      if(!u)return;
      user=u;
      try {
        const existing=await getDoc(doc(db,'users',u.uid,'backups','current'));
        // Avoid overwriting existing local records. Restore only to a clean install.
        if(existing.exists() && typeof data!=='undefined' && data.pets.length===0 &&
          data.health.length===0 && data.logs.length===0 && data.reminders.length===0){
          const restored=existing.data().data;
          if(restored && Array.isArray(restored.pets)){
            data={...seed(),...restored};
            localStorage.setItem('petcare_data_v1',JSON.stringify(data));
            activePet=data.pets[0]?.id||null;
            render();
          }
        }
        if(pending){const next=pending;pending=null;await push(next)}
      } catch(e){console.warn('Cloud restore failed:',e)}
    });
    await signInAnonymously(auth);
  } catch(e){console.warn('Firebase initialization unavailable:',e)}
})();
