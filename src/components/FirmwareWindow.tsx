import React, {FC, useState, useEffect} from 'react';
import {remote} from 'electron';
import path from 'path';

interface FirmwareWindowProps {
    onUpdateClick: () => void;
}

export const FirmwareWindow: FC<FirmwareWindowProps> = (props: FirmwareWindowProps) => {
    const [inputValue, setInputValue] = useState("")

    const onUpload = async () => {
        const file = await remote.dialog.showOpenDialog({
            filters: [
                {
                    name: "All",
                    extensions: ['*']
                },
                {
                    name: 'Binary Files',
                    extensions: ['hex']
                }, 
            ],
        })
        if (file.filePaths.length > 0) {
            const filePath = file.filePaths[0]
            console.log("set")
            setInputValue(path.basename(filePath))
        }
    }
 
    return (
        <div className="backgroundFirmware">
            <div className="iconFirmware"/>
            <p>Firmware</p>
            <div className="firmwareUploadContainer">
                <div className="firmwareTextBlock">
                    <p className={inputValue == "" ? 'firmwareUploadTextInactive' : 'firmwareUploadTextActive'}>
                        {inputValue == "" ? "Select hex file" : inputValue}
                    </p>
                </div>
                <label>
                    <div 
                        className="firmwareUploadBtn" 
                        onClick={onUpload}
                        />
                </label>     
                <button onClick={props.onUpdateClick}>Update</button>
            </div>
        </div>    
    )  
}
