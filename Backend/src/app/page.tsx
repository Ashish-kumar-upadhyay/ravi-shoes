export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem" }}>
      <h1>Treadly Backend API</h1>
      <p>Shoes e-commerce API — MongoDB + Next.js</p>
      <ul>
        <li>
          <a href="/api/health">GET /api/health</a>
        </li>
        <li>POST /api/auth/register</li>
        <li>POST /api/auth/login</li>
        <li>GET /api/products</li>
      </ul>
    </main>
  );
}
