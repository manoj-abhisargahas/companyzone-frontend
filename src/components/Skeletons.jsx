import { useState } from 'react'
import error_icon from "../assets/images/error-icon.svg"


// VISUAL FALLBACK ELEMENT
// This shows up during the split-second while the browser fetches the new JavaScript chunk
export const PageLoaderSkeleton = () => {
  return(
    <div className='skeleton-container'>
      <div className='skeleton' style={{height:'50px'}}></div>
      <div className='skeleton' style={{height:'50px'}}></div>
      <div className='skeleton' style={{height:'300px'}}></div>
    </div>
  );
};

// Isolated Row Skeleton aligning perfectly with true column layouts
export function SkeletonRow() {
    return (
        <tr className="skeleton-wrapper">
            <td colSpan="1000"><span className="skeleton"></span></td>
        </tr>
    );
}

// Isolated Image tag with Skeleton included aligning perfectly with true any element
export function ImageWithSkeleton({src, alt}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    
    const imgClassName = isLoaded?(isError?'err':''):'loading';
    console.log(imgClassName);
    const handleImgOnLoad = () => {
        setIsLoaded(true);
    };
    const handleImgOnError = (e) => {
        // If this new error_icon fails as well, 
        // do not run this error function a second time. Just stop
        e.target.onerror = null;
        e.target.src = error_icon; // Swap to fallback image
        setIsError(true);
    }
    return (
        <div className={`img-cont ${imgClassName}`}>
            {src && !(isLoaded || isError) && <div className='skeleton'></div>}
            {src && <img src={src} alt={alt}
            loading='lazy'
            onLoad={handleImgOnLoad}
            onError={handleImgOnError} />}
        </div>
    );
}
