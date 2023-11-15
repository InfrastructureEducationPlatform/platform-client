import {useState, useEffect} from 'react';
import {sketchApi } from '../api';
import { AxiosHeaders } from "axios";
import { SketchResponse } from '../libs/core-api/api';

class Sketch implements SketchResponse{}

export function SketchList(){
    const [selectedChannelId, ] = useState(localStorage.getItem('selectedChannelId')||'');
    const [sketchList, setSketchList] = useState([]);
    async() =>{
        let accessToken:string = localStorage.getItem("accessToken")||"";
        const headers = new AxiosHeaders();
        headers.setAuthorization(`Bearer ${accessToken}`);
        
        const response = await sketchApi.listSketchesInChannelAsync(selectedChannelId, {headers});
        setSketchList(response.data);

        
        
        sketchList.forEach( => {
            
        });
    }
    
}