namespace TeamCraft.FilterLogic;
using TeamCraft.Model;

public class FilterMembers
{
    public FilterMembers((int, int) ageRange, string hobbiesPerson, string skillsPerson, bool strictSearch = false)
    {
        this.ageRange = ageRange;
        this.hobbiesPerson = hobbiesPerson;
        this.skillsPerson = skillsPerson;
        this.strictSearch = strictSearch;
    }

    private (int, int) ageRange;
    private string hobbiesPerson;
    private string skillsPerson;
    private bool strictSearch;

    public  bool IsEqual(Person targetPerson)
    {
        Helper.CalculateAgePerson(targetPerson.databirthday);
        return false;
    }

    public  int ProcentEqual()
    {
        throw new NotImplementedException();
    }
}
