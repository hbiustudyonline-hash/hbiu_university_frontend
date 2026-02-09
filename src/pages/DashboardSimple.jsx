import { useAuth } from "@/hooks/useAuth";

export default function DashboardSimple() {
  const { user } = useAuth();

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>
          Welcome, {user?.firstName || user?.full_name || 'Student'}!
        </h1>
        <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>Student Dashboard</p>
      </div>

      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginTop: 0 }}>User Information</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>First Name:</strong> {user?.firstName}</p>
        <p><strong>Last Name:</strong> {user?.lastName}</p>
        <p><strong>Status:</strong> {user?.status}</p>
      </div>

      <div style={{
        background: '#e8f4f8',
        padding: '20px',
        borderRadius: '8px',
        borderLeft: '4px solid #667eea'
      }}>
        <h3 style={{ marginTop: 0 }}>Dashboard is Loading...</h3>
        <p>Your full dashboard will be available shortly. In the meantime, you have successfully logged in!</p>
      </div>
    </div>
  );
}
