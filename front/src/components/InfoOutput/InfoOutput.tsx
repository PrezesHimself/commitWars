import React, { Fragment, useState, useEffect } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonItem } from '@ionic/react';

import * as test from '../../test.json';

const InfoOutput: React.FC = () => {
    const [data, setData] = useState('');

    useEffect(() => {
        setData((test as any).default);
        console.log((test as any).default);
    }, []);

    const info = data as any;

    useEffect(() => {
        let releases = info.releases;
        console.log(releases && Object.keys(releases))
    })

    return (
        <Fragment>
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>
                        {`${info.name}!`}
                    </IonCardTitle>
                </IonCardHeader>
                    {
                        info.releases && Object.keys(info.releases).forEach(release => <IonItem> {release} </IonItem>)
                    }
                
            </IonCard>
        </Fragment>
    )
}

export default InfoOutput;