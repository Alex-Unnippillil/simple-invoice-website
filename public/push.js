async function getPublicKey() {
    const res = await fetch('/api/push/public-key');
    const data = await res.json();
    return data.key;
}
export async function subscribe() {
    const registration = await navigator.serviceWorker.register('/sw.js');
    const key = await getPublicKey();
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: key
    });
    await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
    });
    return subscription;
}
export async function unsubscribe() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
        await fetch('/api/push/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
        });
        await subscription.unsubscribe();
    }
}
