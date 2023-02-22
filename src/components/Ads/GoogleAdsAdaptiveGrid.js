import React, { useEffect  } from 'react';

const GoogleAdsAdaptiveGrid = () => {

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
            data-ad-format="autorelaxed"
            data-ad-client="ca-pub-8714967804560253"
            data-ad-slot='9638326452'></ins>
        </>
    );
};

export default GoogleAdsAdaptiveGrid;