import { SketchResponse } from "../libs/core-api/api";

export function SketchListElement(sketchInfo : SketchResponse){
    return(
        <div style={{
            height: '305px',
            width: '350px',
            borderRadius: '15%',
            
        }}>
            <div className="sketchPrievewImg"
                style={{
                    width: '100%',
                    height: '70%',
                    backgroundColor: "black",
                    overflow: "hidden",
                }}>
                    <img src=""/>
                </div>
            <div className="sketchElementBar"
                style={{
                    width: '100%',
                    height: '68px',
                }}
                >
                <a>{sketchInfo.name}</a>
            </div>
            
        </div>
    )
}