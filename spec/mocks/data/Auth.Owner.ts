export const AuthOwnerData = {
    Users: [
        {
            site_user_id: 1,
            security_profile_id: 1,
            site_user_name: 'Tali Vasna',
            site_user_active: 'Y'
        },
        {
            site_user_id: 2,
            security_profile_id: 1,
            site_user_name: 'Jeffery Doyle',
            site_user_active: 'Y'
        },
        {
            site_user_id: 3,
            security_profile_id: 2,
            site_user_name: 'Ihero',
            site_user_active: 'Y'
        },
        {
            site_user_id: 4,
            security_profile_id: 1,
            site_user_name: 'Dorn',
            site_user_active: 'N'
        }
    ],
    Roles: [
        {
            role_id: 1,
            role_name: 'SiteUser',
            role_description: 'Basic Site User Role',
            role_default_flag: 'Y'
        },
        {
            role_id: 2,
            role_name: 'Referee',
            role_description: 'Referee Role',
            role_default_flag: 'N'
        },
        {
            role_id: 3,
            role_name: 'Admin',
            role_description: 'Admin Role',
            role_default_flag: 'N'
        }
    ],
    UserRoles: [
        {
            site_user_id: 1,
            role_id: 1
        },
        {
            site_user_id: 1,
            role_id: 2
        },
        {
            site_user_id: 2,
            role_id: 1
        },
        {
            site_user_id: 3,
            role_id: 1
        },
        {
            site_user_id: 3,
            role_id: 2
        },
        {
            site_user_id: 3,
            role_id: 3
        }
    ],
    UserProfiles: [
        {
            site_user_id: 1,
            site_user_profile_first_name: 'Tali',
            site_user_profile_last_name: 'Vasna'
        },
        {
            site_user_id: 2,
            site_user_profile_first_name: 'Jeffery',
            site_user_profile_last_name: 'Doyle'
        },
        {
            site_user_id: 3,
            site_user_profile_first_name: 'Ihero',
            site_user_profile_last_name: 'Mason'
        },
        {
            site_user_id: 4,
            site_user_profile_first_name: 'Dorn',
            site_user_profile_last_name: 'Terrence'
        }
    ],
    SecurityProfiles: [
        {
            security_profile_id: 1,
            security_profile_name: 'SiteUser',
            security_profile_description: 'Basic site user security profile',
            security_profile_default_flag: 'Y',
        },
        {
            security_profile_id: 2,
            security_profile_name: 'Admin',
            security_profile_description: 'Basic site user security profile',
            security_profile_default_flag: 'N',
        }
    ]
}