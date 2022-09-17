const ActivePage = window.location.pathname;
console.log(ActivePage);

const activeNav = document.querySelectorAll('nav a').forEach(
    MyLinks => {
        if (MyLinks.href.includes(`${ActivePage}`)) {
            MyLinks.classList.add('Active');
        }

    }
)

const activeFooter = document.querySelectorAll('footer a').forEach(
    MyLinks => {
        if (MyLinks.href.includes(`${ActivePage}`)) {
            MyLinks.classList.add('ActiveFooter');
        }

    }
)

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0 so need to add 1 to make it 1!
var yyyy = today.getFullYear();
if(dd<10){
  dd='0'+dd
} 
if(mm<10){
  mm='0'+mm
} 

today = yyyy+'-'+mm+'-'+dd;
var tDate = new Date(today);


function LastDateCheck()
{
  var LDate= document.getElementById('LastDate').value;
  var lDate = new Date(LDate);
  
  if(tDate!= '' && lDate!= '' && tDate > lDate)
    {
    alert("Please ensure that the 'last date for suggestions' is greater than today.");
    return false;
    }
}

function SignUpCheck()
{
    //birth-date check + password check
  var BDate= document.getElementById('Birth-Date').value;
  var bDate = new Date(BDate);

  var EighteenYearsAgo = new Date();
  var YearEighteenYearsAgo = yyyy-18;
  EighteenYearsAgo = YearEighteenYearsAgo+'-'+mm+'-'+dd;
  var EighteenYearsAgoDate = new Date(EighteenYearsAgo);

  var Pass= document.getElementById('password').value;
  var CheckPass= document.getElementById('CheckPassword').value;

  if(bDate > EighteenYearsAgoDate){
    if(Pass!= '' && CheckPass!= '' && Pass != CheckPass){
        alert("Please ensure that you type yout password correct in 2 places. Use of this website is for 18+ years old.");
    } else{
        alert("Use of this website is for 18+ years old.");
    }
    return false;
    }

  if(Pass!= '' && CheckPass!= '' && Pass != CheckPass)
    {
    alert("Please ensure that you type yout password correct in 2 places.");
    return false;
    }
}
