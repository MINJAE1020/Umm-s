import React, { useState } from 'react';
//import DaumPostcode from 'react-daum-postcode';

const MemberInfoUpdate = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tool1, setTool1] = useState('toolA');
  const [address, setAddress] = useState('');
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const handlePostcodeComplete = (data) => {
    setAddress(data.address);
    setIsPostcodeOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ email, password, tool1, address });
  };

  return (
    <div style={{ width: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <h2>Member Information Update</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Change Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Change Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="tool1">Change Discharge Tool (1)</label>
          <select
            id="tool1"
            value={tool1}
            onChange={(e) => setTool1(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          >
            <option value="toolA">Tool A</option>
            <option value="toolB">Tool B</option>
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="address">Set My Location</label>
          <input
            type="text"
            id="address"
            value={address}
            readOnly
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '8px' }}
          />
          <button type="button" onClick={() => setIsPostcodeOpen(true)} style={{ width: '100%', padding: '8px' }}>
            Search Address
          </button>
        
        </div>
        <button type="submit" style={{ width: '100%', padding: '8px' }}>Update</button>
      </form>
    </div>
  );
};

export default MemberInfoUpdate;
