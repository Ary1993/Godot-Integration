import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';
// import { Products } from "react-router-dom";  esta seria la ruta donde quiero que vaya cuando se haga clic en alguna imagen

export const Slider = () => {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("https://static.eldiario.es/clip/efcb080a-e567-4218-b116-a00b91d4ce3b_16-9-discover-aspect-ratio_default_0.webp")',
          backgroundSize: 'cover',
          opacity: 0.4,}} />  
                 
      <Carousel>
         {/* agregar la etiqueta <link>  en image o mejor dicho, q que contenga esta etiqueta <link> la etiqueta de <Image />  para que pueda enviarnos a Products */}
         <Carousel.Item>
            <Image src="https://res.cloudinary.com/dbo3rxwzc/image/upload/v1712251976/CoD4.png.jpg" alt="First slide"
             style={{ width: '300px', height: '500px',  marginRight: '15px' }} thumbnail />
             <Image src="https://res.cloudinary.com/dbo3rxwzc/image/upload/v1712251592/GTAsanandreas.png.jpg" alt="Second slide"
             style={{ width: '300px', height: '500px', marginRight: '15px' }} thumbnail />
             <Image src="https://cdn1.epicgames.com/offer/3ddd6a590da64e3686042d108968a6b2/EGS_GodofWar_SantaMonicaStudio_S2_1200x1600-fbdf3cbc2980749091d52751ffabb7b7_1200x1600-fbdf3cbc2980749091d52751ffabb7b7" alt="Sixth slide" 
            style={{ width: '300px', height: '500px' }} thumbnail />
          </Carousel.Item>
          <Carousel.Item>
            <Image src="https://res.cloudinary.com/dbo3rxwzc/image/upload/v1712251592/GTAsanandreas.png.jpg" alt="Second slide"
             style={{ width: '300px', height: '500px' }} thumbnail />
          </Carousel.Item>
          <Carousel.Item>
            <Image src="https://res.cloudinary.com/dbo3rxwzc/image/upload/v1712255901/yugioh.jpg" alt="Third slide" 
            style={{ width: '300px', height: '500px' }} thumbnail />
          </Carousel.Item>
          <Carousel.Item>
            <Image src="https://static.wikia.nocookie.net/theassassinscreed/images/6/6d/Assassin%27s_Creed_IV_Black_Flag.jpg/revision/latest?cb=20130725070525&path-prefix=es" alt="Fourth slide"
             style={{ width: '300px', height: '500px' }} thumbnail />
          </Carousel.Item>
          <Carousel.Item>
            <Image src="https://segaretro.org/images/thumb/2/2b/Yakuza_PS2_US_Manual.pdf/page1-2131px-Yakuza_PS2_US_Manual.pdf.jpg" alt="Fifth slide" 
            style={{ width: '300px', height: '500px' }} thumbnail />
          </Carousel.Item>
          <Carousel.Item>
            <Image src="https://cdn1.epicgames.com/offer/3ddd6a590da64e3686042d108968a6b2/EGS_GodofWar_SantaMonicaStudio_S2_1200x1600-fbdf3cbc2980749091d52751ffabb7b7_1200x1600-fbdf3cbc2980749091d52751ffabb7b7" alt="Sixth slide" 
            style={{ width: '300px', height: '500px' }} thumbnail />
          </Carousel.Item>
          <Carousel.Item>
            <Image src="https://image.api.playstation.com/vulcan/ap/rnd/202206/0206/WmriZBRlSeXWEEDLJOWW7MdW.png" alt="seventh slide"
             style={{ width: '70%', height: '500px' }} thumbnail />
          </Carousel.Item>
          {/* este ultimo esta en modo estirado, para que vean como  queda */}

      </Carousel>
    </div>
  );
};

