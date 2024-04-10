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
          <Link to="/product/">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/v1712251976/CoD4.png.jpg" alt="First slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/v1712251592/GTAsanandreas.png.jpg" alt="Second slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://cdn1.epicgames.com/offer/3ddd6a590da64e3686042d108968a6b2/EGS_GodofWar_SantaMonicaStudio_S2_1200x1600-fbdf3cbc2980749091d52751ffabb7b7_1200x1600-fbdf3cbc2980749091d52751ffabb7b7" alt="Sixth slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://img.asmedia.epimg.net/resizer/v2/6PXBCBWCGRO2HI7NANOQVLNXA4.jpg?auth=528802000750e1c6bc05a5ce80b4c17f52e3018e2c7a4ca0213ca0b1479f67c6&width=1200&height=1200&smart=true" alt="Third slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
        </Carousel.Item>
        <Carousel.Item>
          <Link to="/product/">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/v1712251592/GTAsanandreas.png.jpg" alt="Second slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/v1712255901/yugioh.jpg" alt="Third slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://static.wikia.nocookie.net/theassassinscreed/images/6/6d/Assassin%27s_Creed_IV_Black_Flag.jpg/revision/latest?cb=20130725070525&path-prefix=es" alt="Fourth slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://image.api.playstation.com/vulcan/ap/rnd/202206/0206/WmriZBRlSeXWEEDLJOWW7MdW.png" alt="Fourth slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
        </Carousel.Item>
        <Carousel.Item>
          <Link to="/product/">
            <img src="https://segaretro.org/images/thumb/2/2b/Yakuza_PS2_US_Manual.pdf/page1-2131px-Yakuza_PS2_US_Manual.pdf.jpg" alt="Fifth slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://res.cloudinary.com/dbo3rxwzc/image/upload/v1712251577/DMC.png.jpg" alt="Sixth slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://slack-imgs.com/?c=1&o1=ro&url=https%3A%2F%2Fres.cloudinary.com%2Fdbo3rxwzc%2Fimage%2Fupload%2Fv1712251604%2Fhalflife.png.jpg" alt="Sixth slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
          <Link to="/product/">
            <img src="https://static.wikia.nocookie.net/theassassinscreed/images/6/6d/Assassin%27s_Creed_IV_Black_Flag.jpg/revision/latest?cb=20130725070525&path-prefix=es" alt="Second slide"
              style={{ width: '220px', height: '370px', margin: '20px' }} />
          </Link>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};