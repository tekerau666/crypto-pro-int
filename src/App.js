/* eslint-disable no-const-assign */
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {Container, Button, Textarea, FormLabel, FormControl} from 'react-bootstrap';
import { getUserCertificates,createAttachedSignature,createHash } from 'crypto-pro';

function Example() {
    const [thumb, setThumb] = useState('');
    const [fileName, setFileName] = useState(null);
    const [certificateList, setCertificateList] = useState([]);
    const [filecontent, setFilecontent] = useState(null);

    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = res => {
                resolve(res.target.result);
            };
            reader.onerror = err => reject(err);
            reader.readAsArrayBuffer(file);
            console.log(file.name);
        });
    }

    let signature = " ";

    useEffect(() => {
        getUserCertificates().then(certificates => {
            setCertificateList(certificates);
        }).catch(error => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        if (fileName != null) {
            readFile(fileName).then(contents => {
                setFilecontent(contents);
            });
        } else {
            setFilecontent(null);
        }
    }, [fileName])

    const sign_string = async() => {
        if((filecontent!=null)&&(thumb.value!=='')){
            let s='';
            const messHash = await createHash(filecontent);
            console.log(messHash);
            s = await createAttachedSignature(thumb.value, messHash);
            console.log(s);
            console.log(typeof s);
            return s;
        }
    }

    // async function sign() {
    //     console.log(signature);
    //     console.log(typeof signature);
    //     signature = sign_string();
    //     console.log(signature);
    //     console.log(typeof signature);
    // }

    const download = async() => {
        // Code to handle downloading
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(signature));
        element.setAttribute('download', fileName.name + '.sgn');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    return (
        <Container>
            <span>Установленные сертификаты:</span>
            <Select
                id="certificate"
                name="certificate"
                options={certificateList.map(cert => ({ value: cert.thumbprint,label: `${cert.name}, действителен до: ${cert.validTo}` }))}
                value={thumb}
                onChange={setThumb}
            />
            <a href="https://www.cryptopro.ru/sites/default/files/products/cades/demopage/cades_bes_sample.html" target="_blank">
                Проверка работы плагина, получение сертификатов
            </a>
            <br /><br />
            <input
                type="file"
                onChange={event => setFileName(event.target.files[0])}
                placeholder="Выберите файл..."
            />
            <br /><br />
            <Button disabled={!thumb || !fileName} onClick={sign_string}>Подписать</Button>
            <br /><br />
            <FormControl
                as="textarea"
                rows={3}
                value={signature}
            />
            <br />
            <Button disabled={!signature} onClick={() => download(fileName, signature)}>Скачать файл ЭП</Button>
            <br />
            <a href="https://crypto.kontur.ru/verify#" target="_blank">
                Проверка ЭП
            </a>
        </Container>
    );
}
export default Example;
