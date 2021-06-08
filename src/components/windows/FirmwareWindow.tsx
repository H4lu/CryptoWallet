import React, {FC, useState} from 'react';
import {remote} from 'electron';
import path from 'path';


export const FirmwareWindow: FC = () => {
    const [inputValue, setInputValue] = useState("")

    const onUpdate = () => {
        remote.dialog.showErrorBox("Error", "Firmware update not completed!")
    }

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
            setInputValue(path.basename(filePath))
        }
    }
 
    return (
        <div className="backgroundFirmware">
            <div className="iconFirmware"/>
            <p>Firmware</p>
            <div className="firmwareUploadContainer">
                <div className="firmwareTextBlock">
                    <p className={inputValue == "" ? "firmwareUploadTextInactive" : "firmwareUploadTextActive"}>
                        {inputValue == "" ? "Select hex file" : inputValue}
                    </p>
                </div>
                <div 
                    className="firmwareUploadBtn" 
                    onClick={onUpload}
                />
              
                <button onClick={onUpdate}>Update</button>
            </div>
        </div>    
    )  
}
