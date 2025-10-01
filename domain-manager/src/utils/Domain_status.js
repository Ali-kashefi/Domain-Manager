export default function Domain_status(state) {

    switch (state) {
        case 1:
            return (<p  className="text-amber-500 bg-amber-300 text-center rounded-3xl text-sm">pending</p>)

        case 2:
            return (<p className="text-green-500 bg-green-300 text-center rounded-3xl text-sm">verified</p>);
        case 3:
            return (<p className="text-red-500 bg-red-300 text-center rounded-3xl text-sm">rejected</p>);


    }
}