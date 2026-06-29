using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepository memberRepo) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            return Ok(await memberRepo.GetMembersAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await memberRepo.GetMemberByIdAsync(id);

            if (member == null) return NotFound();

            return member;
        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetPhotos(string id)
        {
            var photos = await memberRepo.GetPhotosForMembersAsync(id);
            return Ok(photos);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();

            var member = await memberRepo.GetMemberForUpdate(memberId);
            if (member == null) return BadRequest("Could not get the member");

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;
            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            memberRepo.Update(member); //optional to avoid unchanged and on save a badRequest.
            if (await memberRepo.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update member.");
        }

    }
}
