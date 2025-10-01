export default function Activestatuslabel(status: boolean) {
  return status 
    ? (<p className="text-green-500"> Active </p>) 
    : (<p> Inactive</p>); 
}