import React, { useState } from 'react';
import Select from 'react-select';
import {Container, Button, Textarea, FormLabel, FormControl} from 'react-bootstrap';

function Example() {
    const [thumb, setThumb] = useState('');
    const [fileName, setFileName] = useState(null);
    const [signature, setSignature] = useState('');

    const certificateList = [{ thumbprint: '1', name: 'Certificate 1', validTo: '2022-01-01' }, { thumbprint: '2', name: 'Certificate 2', validTo: '2022-02-01' }];

    const sign = () => {
        // Code to handle signing
    }

    const download = (fileName, signature) => {
        // Code to handle downloading
    }

    return (
        <Container>
            <span>Установленные сертификаты:</span>
            <Select
                id="certificate"
                name="certificate"
                options={certificateList.map(cert => ({ value: cert.thumbprint, label: "${cert.name}, действителен до: ${cert.validTo}" }))}
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
            <Button disabled={!thumb} onClick={sign}>Подписать</Button>
            <br /><br />
            <FormControl
                as="textarea"
                rows={3}
                value={signature}
                onChange={event => setSignature(event.target.value)}
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
