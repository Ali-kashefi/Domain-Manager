export default function Domain_status( state ) {

    switch (state) { 
        case 1: 
            return "pending";
        case 2: 
            return "verified";
        case 3:
            return "rejected"; 

      
    }
}