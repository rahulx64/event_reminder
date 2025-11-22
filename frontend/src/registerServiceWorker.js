export async function registerSW(){
  if('serviceWorker' in navigator){
    try{
      const reg = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      console.log('Service Worker registered successfully:', reg);
      return reg;
    }catch(e){
      console.warn('Service Worker registration failed:', e);
      throw e;
    }
  } else {
    console.warn('Service Workers are not supported in this browser');
  }
}

export async function subscribeForPush(token){
  if(!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications not supported');
    return;
  }
  
  try {
    const reg = await navigator.serviceWorker.ready;
    
    // Get VAPID public key
    const vapidPublic = import.meta.env.VITE_VAPID_PUBLIC;
    
    if (!vapidPublic) {
      console.warn('VAPID_PUBLIC key not configured');
      return;
    }
    
    // Check if already subscribed
    let sub = await reg.pushManager.getSubscription();
    
    if (!sub) {
      // Subscribe to push
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublic)
      });
      console.log('Push subscription created:', sub);
    } else {
      console.log('Already subscribed to push');
    }
    
    // Send subscription to backend
    const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(sub)
    });
    
    if (res.ok) {
      console.log('Push subscription saved to backend');
    } else {
      console.warn('Failed to save subscription to backend');
    }
  } catch (e) {
    console.warn('Push subscription error:', e);
  }
}

function urlBase64ToUint8Array(base64String) {
  if (!base64String) return null;
  
  try {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  } catch (err) {
    console.error('Error converting VAPID key:', err);
    return null;
  }
}
