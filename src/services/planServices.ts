import api from '../config/api';

const PlanServices = {
    createPlan: async (plan: FormData) => {
        try {
            const response = await api.post(`/plans/add-plan/${plan.get('ownerId')}`, plan, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': localStorage.getItem('token')
                },
            });
            console.log(response);
            return response.status === 201 ? true : false;
        } catch (error) {
            console.error('Error creating plan: ' + error);
            return false;
        }
    },
    getPlansByOwnerId: async (ownerId: string) => {
        try {
            const response = await api.get(`/plans//plans-by-owner/${ownerId}`, {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                },
            });
            console.log(response);
            return response.data;
        } catch (error) {
            console.error('Error fetching plans by owner ID: ' + error);
            return null;
        }
    }
};

export default PlanServices;
