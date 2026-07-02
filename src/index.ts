import {createClient} from 'redis';
import { downloadS3 } from './aws.js';

const subscriber= createClient();
subscriber.connect();

const main= async ()=>{
    while(true){
        const response = await subscriber.brPop(
            'build-queue',
            10
        );
        if (response) {
            console.log(response);
            await downloadS3(`/Output/${response.element}`);
        }
    }
};
main();