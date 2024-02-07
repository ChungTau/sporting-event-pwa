import api from '../config/api';

const PlanServices = {
    createPlan : async (plan: FormData) => {
        try{
            const response = await api.post('/plans/add-plan', plan, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': localStorage.getItem('token')
                },
            });
            console.log(response);
            return response.status === 201 ?true : false;
        }catch(error){
            console.error('Error creating plan: ' + error);
            return false;
        }
    }
}

export default PlanServices;