import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page-container">
      <div className="about-page-header">
        <div className="overlay"></div>
        <motion.div 
          className="header-content text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Small Beginnings</h1>
          <div className="divider"></div>
          <h2>Our Philosophy</h2>
        </motion.div>
      </div>

      <div className="container about-content-wrapper">
        <motion.div 
          className="about-section text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="section-subtitle">Mediterranean & International Cuisine</h3>
          <p className="lead-text">
            Born from the vision of a dreamer from Greece, The Fig & Olive brings the Mediterranean spirit to the Isle of Man. 
            Our amazing team have created a menu without geographical restrictions, marrying classic Mediterranean, 
            Asian and international flavours for the most imaginative and unexpected dishes.
          </p>
          <p>
            His and our philosophy: the desire to please and excite the palate, captivate and deeply satisfy all five senses 
            by fusing everyday cooking with modern quality ingredients from around the world.
          </p>
        </motion.div>

        <div className="about-grid">
          <motion.div 
            className="about-grid-item"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="about-image-wrapper">
              <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop" alt="Mediterranean Cuisine" />
            </div>
          </motion.div>
          <motion.div 
            className="about-grid-item text-content"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p>
              On our menu you will find old favourites from when we began all those years ago alongside new seasonal dishes 
              and specials from the new ingredients that are delivered daily into our kitchen.
            </p>
            <p>
              Our menu changes regularly following the seasons and is alive with sunbaked tastes and aromas, radiating all 
              the colours and textures of the sea and the land, and brimming with the mood of the Med.
            </p>
            <p className="highlight-text">
              Every dish is cooked to order. We are not fussy, just skilled, imaginative and full of the unexpected.
            </p>
            <p>
              Our mission is to delight and surprise and ensure everybody walks out with a smile on their face, 
              wondering when they can do it all again!
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="about-section text-center aim-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="section-subtitle">We aim to please everyone</h3>
          <p>
            Whether it’s a romantic dinner for two or a larger group, The Fig & Olive has so much to offer including our 
            à la carte menu, young guest menu, lunch and brunch menus, dedicated vegan menu, gluten free and vegetarian 
            options, blackboard specials and bespoke party menus. This ensures there is something for every budget.
          </p>
          <p>
            In addition, the expertly chosen wine list offers exceptional value with a wide selection of wines, 
            with several available to purchase by the glass.
          </p>
          <p>
            We also have a wide range of trendy cocktails, premium spirits, Davison’s Manx ice cream and a homemade 
            dessert menu to die for!!!
          </p>
          <div className="mt-4" style={{ marginTop: '30px' }}>
             <Link to="/book" className="btn-primary">Book your table</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
