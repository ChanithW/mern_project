import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Label, TextInput, Card, Alert } from 'flowbite-react';
import bgImage from '../assets/images/shrilanka-tea-estates.jpg';
import Header from '../components/header';
import AuthContext from '../context/AuthContext';

function FertilizationLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(username, password, 'Fertilization & disease management');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
        <Card className="w-96 p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Fertilization Management Login</h2>
          {error && (
            <Alert color="failure" className="mb-4">
              {error}
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" value="Username" />
              <TextInput
                id="username"
                type="text"
                placeholder="Enter username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" value="Password" />
              <TextInput
                id="password"
                type="password"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              gradientDuoTone="greenToBlue" 
              className="bg-green-500 text-white w-full py-2 mt-4"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default FertilizationLogin;
