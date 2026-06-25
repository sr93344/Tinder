import { Service } from '@angular/core';

@Service()
export class ToastService {

    private createToastContainer(message:string, type: string) {
        const toastContainer = document.getElementById("toast-container");
        if (toastContainer) {
            const toast = document.createElement("div");
            toast.id = "toast";
            toast.innerHTML = this.createToastElement(message, type);
            toastContainer.appendChild(toast);

            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 6000)
        }
    }

    private createToastElement(message:string, type: string){
        
        // 2. Safe fallback defaults to blue if an invalid type is typed
        const currentTheme = themes[type] || themes.blue;
        return `
            <div class="max-w-xs w-full ${currentTheme.bg} ${currentTheme.text} text-sm rounded-xl shadow-lg" role="alert" tabindex="-1">
                <div class="flex p-4">
                    ${message}
                    <div class="ms-auto">
                    <button type="button" class="shrink-0 flex justify-center items-center size-5 ${currentTheme.btnText} opacity-50 hover:opacity-100 focus:outline-hidden" aria-label="Close" onclick="this.closest('[role=\\'alert\\']').remove()">
                        <span class="sr-only">Close</span>
                        <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                    </div>
                </div>
            </div>
        `;
    }

    error(message: string){
        this.createToastContainer(message, "red");
    }
    info(message: string){
        this.createToastContainer(message, "blue");
    }
    warning(message: string){
        this.createToastContainer(message, "yellow");
    }
    success(message: string){
        this.createToastContainer(message, "teal");
    }
}

const themes:any = {
    red: {
      bg: 'bg-red-500',
      text: 'text-foreground-inverse',
      btnText: 'text-foreground-inverse'
    },
    teal: {
      bg: 'bg-teal-500',
      text: 'text-foreground-inverse',
      btnText: 'text-foreground-inverse'
    },
    blue: {
      bg: 'bg-primary',
      text: 'text-primary-foreground',
      btnText: 'text-foreground-inverse'
    },
    yellow: {
      bg: 'bg-yellow-500',
      text: 'text-foreground-inverse',
      btnText: 'text-foreground-inverse'
    }
};
