export async function sendMessage(message: string): Promise<string> {
  const res = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  
  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  const data = await res.json();
  return data.response;
}
