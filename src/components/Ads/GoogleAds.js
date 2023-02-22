import React, { useEffect  } from 'react';

const GoogleAds = () => {

    useEffect(() => {

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }

        catch (e) {
          console.log(e)
        }

    },[]);



    return (
        <>
          <ins class="adsbygoogle"
            style={{ display: "block" }}
            data-ad-format="fluid"
            data-ad-layout-key="-gj-1o-3n-5j+zj"
            data-ad-client="ca-pub-8714967804560253"
            data-ad-slot='5506110957'></ins>
        </>
    );
};

export default GoogleAds;