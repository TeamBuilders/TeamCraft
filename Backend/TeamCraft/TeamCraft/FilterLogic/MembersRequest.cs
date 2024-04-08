namespace TeamCraft.FilterLogic;
using TeamCraft.Model.UserAcrhitecture;

public class MembersRequest
{
    public MembersRequest(int ageFrom, int ageTo, string[] hobbiesPerson, string[] skillsPerson, bool strictSearch = false)
    {
        this.fromAge = ageFrom;
        this.toAge = ageTo;
        this.hobbiesPerson = hobbiesPerson;
        this.skillsPerson = skillsPerson;
        this.strictSearch = strictSearch;
    }

    private int fromAge;
    private int toAge;
    private string[] hobbiesPerson;
    private string[] skillsPerson;
    private bool strictSearch;

    public bool IsEqual(DataUser targetPerson)
    {
        Helper.CalculateAgePerson(targetPerson.databirthday);
        return false;
    }

    public int ProcentEqual()
    {
        throw new NotImplementedException();
    }
}
