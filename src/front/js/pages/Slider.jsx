import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from "react-router-dom";

export const Slider = () => {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: 'url("https://static.eldiario.es/clip/efcb080a-e567-4218-b116-a00b91d4ce3b_16-9-discover-aspect-ratio_default_0.webp")',
          backgroundSize: 'cover',
          opacity: 0.3,
        }} />
      <Carousel>
        <Carousel.Item>
          <Link to="/product/2">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/t_crop/v1712251976/CoD4.png.jpg" alt="First slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/2">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/t_crop/v1712251592/GTAsanandreas.png.jpg" alt="Second slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/2">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/t_crop/v1712251552/GOW.png.jpg" alt="Sixth slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/t_crop/v1712251965/Halo.png.jpg" alt="Third slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
        </Carousel.Item>
        <Carousel.Item>
          <Link to="/product/1">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/t_crop/v1712251592/GTAsanandreas.png.jpg" alt="Second slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/t_crop/v1712255901/yugioh.jpg" alt="Third slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/t_crop/v1712251488/assasincreed.png.jpg" alt="Fourth slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/t_crop/v1712251528/residentevil3.png.jpg" alt="Fourth slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
        </Carousel.Item>
        <Carousel.Item>
          <Link to="/product/">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/t_crop/v1712251564/yakuza.png.jpg" alt="Fifth slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/t_crop/v1712251577/DMC.png.jpg" alt="Sixth slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/t_crop/v1712251604/halflife.png.jpg" alt="Sixth slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/t_crop/v1712251488/assasincreed.png.jpg" alt="Second slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};