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
    },
    getEventsByOwnerId: async (ownerId: string) => {
        try {
            const response = await api.get(`/events/events-by-owner/${ownerId}`, {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                },
            });
            console.log(response);
            return response.data;
        } catch (error) {
            console.error('Error fetching events by owner ID: ' + error);
            return null;
        }
    },
    getEventById: async (id: string) => {
        try {
            const response = await api.get(`/events/${id}`, {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                },
            });
            console.log(response);
            return response.data;
        } catch (error) {
            console.error('Error fetching event by ID: ' + error);
            return null;
        }
    },
}

export default EventServices;