﻿
using TeamCraft.Model.TeamsArchitecture;
namespace TeamCraft.Model.UserAcrhitecture

{
    public class AccountUser
    {
        public AccountUser() { }
        public AccountUser(DataUser dataUser, SettingsProfileUser settingUser)
        {
            this.dataUser = dataUser;
            this.settingsUser = settingUser;
        }

        public int id { get; set; }

        public int dataUserId { get; set; }
        public DataUser dataUser { get; set; }

        public int settingsUserId { get; set; }
        public SettingsProfileUser settingsUser { get; set; }

    }
}
