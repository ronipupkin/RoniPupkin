const ActivePage = window.location.pathname;
console.log(ActivePage);

const activeNav = document.querySelectorAll('nav a').forEach(
    MyLinks => {
        if (MyLinks.href.includes(`${ActivePage}`)) {
            MyLinks.classList.add('Active');
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
//document.getElementById("LastDate").setAttribute("LastDateForSugg", today);//

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

function BirthDATECheck()
{
  var BDate= document.getElementById('Birth-Date').value;
  var bDate = new Date(BDate);

  var EighteenYearsAgo = new Date();
  var YearEighteenYearsAgo = yyyy-18;
  EighteenYearsAgo = YearEighteenYearsAgo+'-'+mm+'-'+dd;
  var EighteenYearsAgoDate = new Date(EighteenYearsAgo);
  
  console.log(EighteenYearsAgoDate);
  console.log(bDate);

  if(bDate > EighteenYearsAgoDate)
    {
    alert("Use of this website is for 18+ years old.");
    return false;
    }
}