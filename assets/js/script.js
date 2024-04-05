//******************//   
//    █ ▄ █ █▀▄
//    █ █ █ █ █
//    ▀▀▀▀▀ ▀▀  ▀
//********//

const q = (element)=> document.querySelector(element)

const menuMobileBtn = q('.open_m-mobile');
const menuMobileCloseBtn = q('.close_m-mobile');
const areaMenuMobile = q('#main-menu ul');

const windowArea = q('.window');
const formCloseBtn = q('.close-form');
const disableFormBtn = document.querySelector('.disable-form')

const intro_Btn_Request = q('.btn-request');
const UP_Btn = q('button.up');

menuMobileBtn.addEventListener("click", Menu_Mobile)
menuMobileCloseBtn.addEventListener("click", Menu_Mobile)

function Menu_Mobile(){
    areaMenuMobile.classList.toggle('show')
}

UP_Btn.addEventListener("click", scroll_Up_Animation)

function scroll_Up_Animation(){
    window.scrollTo({
        top: 0, 
        behavior: 'smooth'
    });
}

const FORM_Valitador = {
    form: q('#form-contact form'),
    openClose:function(){
        if(windowArea.classList.contains('show')){

            windowArea.classList.remove('show')
            q('#form-contact').classList.remove('show')

            document.body.style.overflow = '';
        } else {

            windowArea.classList.add('show')
            q('#form-contact').classList.add('show')

            document.body.style.overflow = 'hidden';
        }
        
        FORM_Valitador.clear()
    },
    getInputs:function(){
        return this.form.querySelectorAll("fieldset input, fieldset textarea")
    },
    identifyRules:[
        {name:["required", "max=20"]},
        {email:["required", {regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/}]},
        {phone:["required", "min=16", "max=16"]},
        {message:["required", "min=15"]}
    ],
    verifyRules:function(){

        return this.identifyRules.map((typeRules, index)=>{
            const typeInputs = this.getInputs()[index].name

            for(let rule of typeRules[typeInputs]){

                let ruleType;
                let ruleValue;

                if(typeof rule == 'object'){
                    ruleType = Object.keys(rule)[0]
                    ruleValue = rule[ruleType]
                } else {
                    const delimiterType = rule.replace("=", "")
                    ruleType = delimiterType.replace(/\d/g, "")

                    const delimiterValue = rule.substring(rule.indexOf("=")+1, rule.length)
                    ruleValue = delimiterValue
                }

                switch(ruleType){
                    case 'required':
                        if(this.rules.required(this.getInputs()[index])){
                            return 'Obrigatório'
                        }
                    break;
                    case 'max':
                        if(this.rules.max(this.getInputs()[index], ruleValue)){
                            return `Máximo de ${ruleValue} caracteres atingigo`
                        }
                    break;
                    case 'min':
                        if(this.rules.min(this.getInputs()[index], ruleValue)){
                            return `Mínimo de ${ruleValue} caracteres`
                        } else if(this.getInputs()[index].name == 'phone'){
                            return `Mínimo de 11 dígitos`
                        }
                        
                    break;
                    case 'regex':
                        if(this.rules.regex(this.getInputs()[index], ruleValue)){
                            return 'Formato e-mail válido: exemplo@email.com'
                        }
                    break;
                }
            }

            return true
        })
    },
    rules:{
        required:function(input){
            if(input.value.length <= 0){
                return true
            }
            return false
        },
        max:function(input, number){
            if(input.value.length > number){
                return true
            }

            return false
        },
        min:function(input, number){
            if(input.value.length < number){
                return true
            }

            return false
        },
        regex:function(input, rule){

            if(rule.test(input.value)){
                return false
            }

            return true
        },
        phoneFormat:function(e){

            let format = ()=>{
                let NUMBER = e.currentTarget.value.replace(/\D/g, '').substring(0, 11)
                
                if(NUMBER.length <= 3){
                    NUMBER = NUMBER.replace(/(\d{2})(\d{1})/, `($1) $2`)
                } else if(NUMBER.length <= 7){
                    NUMBER = NUMBER.replace(/(\d{2})(\d{1})(\d{1})/, `($1) $2 $3`)
                } else if(NUMBER.length <= 11){
                    NUMBER = NUMBER.replace(/(\d{2})(\d{1})(\d{4})(\d{1})/, `($1) $2 $3-$4`)
                }
            
                this.value = NUMBER;
            }
            return format()
        }
    },
    showError:function(msg, index){

        const errorArea = this.form.querySelectorAll('fieldset')[index]

        if(msg[index] !== true){
            errorArea.classList.add('show')
            errorArea.querySelector('.input-area').setAttribute('attr', msg[index])
        } else {
            errorArea.classList.remove('show')
            errorArea.querySelector('.input-area').setAttribute('attr', '')
        }
    },
    submit:function(e){
        let send = false;
    
        for(let i = 0; i < FORM_Valitador.getInputs().length; i++){

            let check = FORM_Valitador.verifyRules()

            if(check.every((rules)=>rules !== true)){

                send = false;

                FORM_Valitador.showError(check, i)

            } else {
                FORM_Valitador.showError(check, i)
            }

            if(check.every((rules)=>rules === true || rules === '')){
                send = true;
                FORM_Valitador.setSubject()
            }
        }

        if(!send){
            e?.preventDefault()
        }
        
    },
    clear:function(){
        for(let i = 0; i < this.getInputs().length; i++){

            const fieldsetEl = this.form.querySelectorAll('fieldset')[i]

            this.getInputs()[i].value = '';

            if(fieldsetEl.classList.contains('show')){

                fieldsetEl.classList.remove('show')
                fieldsetEl.querySelector('.input-area').removeAttribute('attr')
            }
        }
    },
    initializeState:function(){
        
        if(!localStorage.disableForm || localStorage.disableForm === 'false'){
            FORM_Valitador.openClose()
            localStorage.disableForm = 'false';
        }
    },
    toggleDisable:function(){
        let check = disableFormBtn.querySelector('input').checked

        if(check == true){
            localStorage.disableForm = 'true';
        } else {
            localStorage.disableForm = 'false';
        }
    },
    setSubject:function(){
        const subject = this.form.querySelector('input[name=subject]')

        const id = ()=>{
            const now = new Date();
            const year = now.getFullYear().toString().slice(-2);
            const month = ('0' + (now.getMonth() + 1)).slice(-2);
            const day = ('0' + now.getDate()).slice(-2);
            const hours = ('0' + now.getHours()).slice(-2);
            const minutes = ('0' + now.getMinutes()).slice(-2);
            const seconds = ('0' + now.getSeconds()).slice(-2);

            return `${day}${month}${year}${hours}${minutes}${seconds}`;
        }

        for(let input of FORM_Valitador.getInputs()){
            if(input.name == 'name'){
                subject.value = `${input.value} (smklimatiza.com.br) ID ${id()}`
            }
        }
    }
}

disableFormBtn.addEventListener("click", FORM_Valitador.toggleDisable)
formCloseBtn.addEventListener("click", FORM_Valitador.openClose)
FORM_Valitador.form.addEventListener('submit', FORM_Valitador.submit)
FORM_Valitador.form.querySelector('input[name=phone]').addEventListener('input', FORM_Valitador.rules.phoneFormat)


const WHATSAPP = {
    chat: q('.whatsapp-chat'),
    button_openChat: q('.whatsapp-icon'),
    button_CloseChat: q('.whatsapp-chat .closed > button'),
    button_Conversation: q('.whatsapp-chat .main > button'),
    open: function(){
        this.chat.classList.toggle('show')
    },
    action: function(){
    
        let phoneNumber = "5511993037618"
        let message = "Olá! \n\nEstou entrando em contato através do seu site e tenho interesse em obter mais informações."
        let whatsUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    
        window.open(whatsUrl, "_blank");
    }
}

new Array(WHATSAPP.button_openChat, WHATSAPP.button_CloseChat).forEach((e)=>{
    e.addEventListener("click", WHATSAPP.open.bind(WHATSAPP))
}) 

new Array(WHATSAPP.button_Conversation, intro_Btn_Request).forEach((e)=>{
    e?.addEventListener("click", WHATSAPP.action)
})


window.addEventListener("click", close_Show)

function close_Show(event){
    let verify_Buttons = event.target.nodeName !== 'BUTTON'
    let verify_Class = event.target.offsetParent?.closest('.show')

    if(verify_Class == undefined || null){
        verify_Class = true
    } else {
        verify_Class = false
    }

    if(verify_Buttons && verify_Class){
        FORM_Valitador.clear()
        document.querySelector('.show')?.classList.remove('show')
    }
}


FORM_Valitador.initializeState()