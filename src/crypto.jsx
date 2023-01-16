import React, { useState, useEffect } from 'react';
import { getUserCertificates,createDetachedSignature,createHash } from 'crypto-pro';

const readFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = res => {
            resolve(res.target.result);
        };
        reader.onerror = err => reject(err);
        reader.readAsArrayBuffer(file);
        console.log(file.filename);
    });
}

const Certificate = (props) => {
    const [thumb, setThumb] = useState("");
    const [signature, setSignature] = useState("");
    const [file_name, setFileName] = useState(null);
    const [filecontent, setFilecontent] = useState(null);
    const [certificateList, setCertificateList] = useState([]);

    useEffect(() => {
        getUserCertificates().then(certificates => {
            setCertificateList(certificates);
        }).catch(error => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        if (file_name != null) {
            readFile(file_name).then(contents => {
                setFilecontent(contents);
            });
        } else {
            setFilecontent(null);
        }
    }, [file_name])

    const sign = async () => {
        if((filecontent!=null)&&(thumb!='')){
            let s='';
            try {
                const messageHash = await createHash(filecontent);
                console.log(messageHash)
                try {
                    s = await createDetachedSignature(thumb, messageHash);
                    setSignature(s);
                } catch (signatureError) {
                    console.log(signatureError);
                }
            } catch (hashError) {
                console.log(hashError);
            }
        }
    }

    const download = () => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(signature));
        element.setAttribute('download', file_name.name + '.sgn');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    return (
        <div>
            <span>Установленные сертификаты:</span>
            <select id="certificate" name="certificate" required value={thumb} onChange={(event) => setThumb(event.target.value)}>
                {certificateList.map(cert => (
                    <option key={cert.thumbprint} value={cert.thumbprint}>
                        {cert.name}, действителен до: {cert.validTo}
                    </option>
                ))}
            </select>
            <a href="https://www.cryptopro.ru/sites/default/files/products/cades/demopage/cades_bes_sample.html" target="_blank">
                Проверка работы плагина, получение сертификатов
            </a>
            <br/><br/>
            <input type="file" id="file" onChange={(event) => setFileName(event.target.files[0])}/><br/><br/>
            <button disabled={thumb === '' || file_name === null} onClick={sign}>Подписать</button><br/><br/>
            <textarea id="signature" rows="20" value={signature} readOnly/><br/>
            <button disabled={signature === '' || file_name === null} onClick={download}>Скачать файл ЭП</button><br/>
            <a href="https://crypto.kontur.ru/verify#" target="_blank">
                Проверка ЭП
            </a>
        </div>
    );
}

export default Certificate;
