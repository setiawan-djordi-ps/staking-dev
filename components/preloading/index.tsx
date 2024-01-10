import React from 'react';
import { useSpring, animated } from  '@react-spring/web';

const Preloader = () => {
    const animationProps = useSpring({
        from: { background: '#000' },
        to: { background: '#ccc' },
        config: { tension: 200, friction: 10 },
        loop: { reverse: true },
      });
    
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <animated.div style={animationProps}>
            <div style={{ width: '100px', height: '100px', background: '#000' }} />
          </animated.div>
        </div>
      );
};

export default Preloader;