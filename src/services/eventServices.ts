import api from '../config/api';

const EventServices = {
    createEvent: async (event: FormData) => {
        try{
            const response = await api.post('/events/add-event', event, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': localStorage.getItem('token')
                },
            });
            console.log(response);
            return response.status === 201 ? true : false;
        }catch(error){
            console.error('Error creating event: ' + error);
            return false;
        }
    }
}

export default EventServices;