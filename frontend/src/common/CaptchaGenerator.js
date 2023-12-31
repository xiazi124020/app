// CaptchaGenerator.js
import React, { useState } from 'react';
import Button from '@mui/material/Button';

const CaptchaGenerator = () => {
  const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 6;
    let captcha = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      captcha += characters.charAt(randomIndex);
    }

    return captcha;
  };

  const [captcha, setCaptcha] = useState(generateCaptcha());

  const handleRefresh = () => {
    const newCaptcha = generateCaptcha();
    setCaptcha(newCaptcha);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* Left side - Verification code input */}
      <div style={{ flex: 1 }}>
        <h2>Captcha Generator</h2>
        <Button variant="outlined" color="primary" onClick={handleRefresh}>
          Refresh Captcha
        </Button>
        <p>Click the button to refresh the captcha</p>
        {/* Display the captcha as an image or styled text, based on your design */}
        <div style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold' }}>{captcha}</div>
      </div>
      {/* Right side - Verification code image */}
      <div style={{ marginLeft: 20 }}>
        {/* Display the captcha image or placeholder */}
        {/* You can replace the text with an actual image element */}
        <div
          style={{
            width: 100,
            height: 50,
            backgroundColor: '#efefef', // Placeholder background color
            textAlign: 'center',
            lineHeight: '50px',
            cursor: 'pointer',
          }}
          onClick={handleRefresh}
        >
          {/* You can replace this text with an actual image */}
          Image
        </div>
      </div>
    </div>
  );
};

export default CaptchaGenerator;
