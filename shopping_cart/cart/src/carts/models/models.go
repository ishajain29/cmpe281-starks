package models

import "time"

type (
	UserCart struct {
		Id       string    `json:"id"`
		UserId   string    `json:"userid"`
		Products []Product `json:"products"`
	}

	SharedCart struct {
		Id             string    `json:"id"`
		AdminId        string    `json:"adminid"`
		GroupUsers     []string  `json:"groupusers"`
		Products       []Product `json:"products"`
		InviteLink     string    `json:"invitelink"`
		ExpirationLink time.Time `json:"expirationlink"`
	}

	Product struct {
		Id       string  `json:"id"`
		Quantity int     `json:"quantity"`
		Name     string  `json:"name"`
		Price    float32 `json:"price"`
		AddedBy  string  `json:"addedby"`
	}
)
