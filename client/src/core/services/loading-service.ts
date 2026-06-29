import { Service, signal } from '@angular/core';
import { single } from 'rxjs';

@Service()
export class LoadingService {
    loadingRequestCount=signal(0);

    loading(){
        this.loadingRequestCount.update(x => x+1);
    }

    idle(){
        this.loadingRequestCount.update(x => x-1);  
    }
}
